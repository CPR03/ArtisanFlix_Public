import {useState, useEffect} from "react";
import axios from "axios";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import {useRef} from "react";
import "./Stream.css";

import PropTypes from "prop-types";

function Stream({user, searchItem}) {
    const [videos, setVideos] = useState([]); //Contains all the videos
    const [selectedVideoInfo, setSelectedVideoInfo] = useState(null); //Contains the selected video info
    const [playVideo, setPlayVideo] = useState(false); //Check whether the video is playing or not

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); //Check whether the update modal is open or not
    const [videoToUpdate, setVideoToUpdate] = useState(null); //Contains the video to update

    // Filter the videos based on the search item
    const filteredVideos = searchItem ? videos.filter((video) => video.title.toLowerCase().includes(searchItem.toLowerCase()) || video.created_by.toLowerCase().includes(searchItem.toLowerCase())) : []; // Empty array if no search item

    //Fetch all the videos
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get("https://artisan-flix-api.vercel.app/videos");
                setVideos(response.data.videos);
            } catch (error) {
                console.error("Failed to fetch videos:", error);
            }
        };

        fetchVideos();

        //fetch api for new videos every 1 second
        const intervalId = setInterval(fetchVideos, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const modalRef = useRef();

    // Function to handle the video select
    const handleVideoSelect = (video) => {
        setSelectedVideoInfo(video);
        setPlayVideo(false);
        modalRef.current.showModal();
    };

    // Function to play the video
    const handlePlayVideo = () => {
        modalRef.current.close();
        setPlayVideo(true);
    };

    // Function to delete the video
    const handleDeleteVideo = async (id) => {
        try {
            const response = await axios.delete(`https://artisan-flix-api.vercel.app/videos/${id}`);

            if (response.status !== 200) {
                throw new Error("Failed to delete video");
            }

            // Remove the deleted video from the state
            setVideos(videos.filter((video) => video._id !== id));
        } catch (error) {
            console.error("Failed to delete video:", error);
        }
    };

    // Function to update the video
    const handleUpdateVideo = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Prepare the data to update
        const data = {
            title: videoToUpdate.title,
            description: videoToUpdate.description,
            created_by: videoToUpdate.created_by,
            url: videoToUpdate.url,
            thumbnail: videoToUpdate.thumbnail,
        };

        try {
            const response = await axios.put(`https://artisan-flix-api.vercel.app/videos/${videoToUpdate._id}`, data);

            if (response.status !== 200) {
                throw new Error("Failed to update video");
            }

            // Update the video in the state
            setVideos(videos.map((video) => (video._id === videoToUpdate._id ? {...video, ...data} : video)));

            console.log("Video updated!")

            // Close the update modal
            closeUpdateModal();
        } catch (error) {
            console.error("Failed to update video:", error);
        }
    };

    const updateModalRef = useRef();

    // Function to open the update modal
    const openUpdateModal = (video) => {
        setVideoToUpdate(video);
        setIsUpdateModalOpen(true);
    };

    // Function to close the update modal
    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        updateModalRef.current.close();
    };

    // Show the update modal when the isUpdateModalOpen state is true
    useEffect(() => {
        if (isUpdateModalOpen) {
            updateModalRef.current.showModal();
        }
    }, [isUpdateModalOpen]);

    const carouselRef = useRef(null);

    // Function to scroll to a specific slide in the carousel
    const scrollToSlide = (index) => {
        const carousel = carouselRef.current;
        const slides = carousel.children;

        if (slides[index]) {
            // Calculate the new scroll position (determined by the slide's offsetLeft property)
            const newScrollPosition = slides[index].offsetLeft;

            // Scroll the carousel to the new position
            carousel.scrollLeft = newScrollPosition;
        }
    };

    return (
        <>
            {searchItem != "" ? (
                //Check whether the video is available or not
                filteredVideos.length === 0 ? (
                    <h1 className="sectionTitle m-5 font-bold">No results found.</h1>
                ) : (
                    <div className="m-5">
                        <h1 className="sectionTitle font-bold">Search Results</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                            {filteredVideos.map((video) => (
                                <div key={video._id} className="playerTile" onClick={() => handleVideoSelect(video)} style={{backgroundImage: `url(${video.thumbnail})`, backgroundSize: "cover"}}>
                                    <div className="tileOverlay">
                                        <h2 className="vidTitle">{video.title}</h2>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ) : (
                //If the search item is empty
                <div className="flex flex-col items-center mt-5 m-5 mb-10">
                    {/*Carousel for the first 5 recent videos*/}
                    <div className="carousel w-full max-w-[1835px] rounded-lg" ref={carouselRef}>
                        {videos.slice(0, 5).map((video, index) => (
                            <div key={video._id} id={`slide${index + 1}`} className="carousel-item relative w-full">
                                <img src={video.thumbnail} className="w-full thumbnail" />
                                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                    <button
                                        type="button"
                                        className="btn btn-circle"
                                        onClick={() => {
                                            scrollToSlide(index === 0 ? videos.length - 1 : index - 1);
                                        }}
                                    >
                                        ❮
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-circle"
                                        onClick={() => {
                                            scrollToSlide(index + 2 > videos.length ? 0 : index + 1);
                                        }}
                                    >
                                        ❯
                                    </button>
                                </div>

                                <div className="absolute bottom-0 bg-gradient-to-t from-black to-transparent text-white p-4 w-full flex items-center">
                                    <button className="btn btn-primary btn-circle mr-2" onClick={() => handleVideoSelect(video)}>
                                        <img src="https://www.svgrepo.com/show/526106/play.svg" alt="" width={25} />
                                    </button>
                                    <h2 className="overCaroTitle xs:text-2xl sm:text-4xl font-bold">{video.title}</h2>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Shows only the first 5 recent videos*/}
                    <div className="mt-5">
                        <h1 className="sectionTitle font-bold">Latest Release</h1>

                        {!playVideo && (
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5">
                                {videos.slice(0, 5).map((video) => (
                                    <div key={video._id} className="playerTile" onClick={() => handleVideoSelect(video)} style={{backgroundImage: `url(${video.thumbnail})`, backgroundSize: "cover"}}>
                                        <div className="tileOverlay">
                                            <h2 className="vidTitle">{video.title}</h2>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Shows all videos*/}
                    <div className="mt-10">
                        <h1 className="sectionTitle font-bold">Discover more</h1>

                        {!playVideo && (
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5">
                                {videos.slice(5).map((video) => (
                                    <div key={video._id} className="playerTile" onClick={() => handleVideoSelect(video)} style={{backgroundImage: `url(${video.thumbnail})`, backgroundSize: "cover"}}>
                                        <div className="tileOverlay">
                                            <h2 className="vidTitle">{video.title}</h2>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal for video details and updating*/}
            {isUpdateModalOpen && (
                <dialog ref={updateModalRef} className="modal">
                    <div className="modal-box flex flex-col justify-center items-center">
                        <h2 className="text-2xl mb-2">Update Video</h2>

                        <form method="POST" onSubmit={handleUpdateVideo} className="space-y-3 p-6 rounded-lg items-center">
                            <div>
                                <label>Title</label>
                                <div className="input input-bordered flex items-center gap-2">
                                    <input type="text" value={videoToUpdate.title} onChange={(e) => setVideoToUpdate({...videoToUpdate, title: e.target.value})} className="flex-grow" placeholder="Title" required />
                                </div>
                            </div>

                            {/* Enter description update */}
                            <div>
                                <label>Description</label>
                                <div>
                                    <textarea value={videoToUpdate.description} onChange={(e) => setVideoToUpdate({...videoToUpdate, description: e.target.value})} className="textarea textarea-bordered w-[390px]" placeholder="Description" required />
                                </div>
                            </div>

                            {/* Enter created by update */}
                            <div>
                                <label>Created By</label>
                                <div className="input input-bordered flex items-center gap-2">
                                    <input type="text" value={videoToUpdate.created_by} onChange={(e) => setVideoToUpdate({...videoToUpdate, created_by: e.target.value})} className="flex-grow" placeholder="Created by" required />
                                </div>
                            </div>

                            {/* Enter video url update */}
                            <div>
                                <label>Video URL</label>
                                <div className="input input-bordered flex items-center gap-2">
                                    <input type="text" value={videoToUpdate.url} onChange={(e) => setVideoToUpdate({...videoToUpdate, url: e.target.value})} className="flex-grow" placeholder="https://video.url.here" required />
                                </div>
                            </div>

                            {/* Enter video thumbnail update */}
                            <div>
                                <label>Video Thumbnail</label>
                                <div className="input input-bordered flex items-center gap-2">
                                    <input type="text" value={videoToUpdate.thumbnail} onChange={(e) => setVideoToUpdate({...videoToUpdate, thumbnail: e.target.value})} className="flex-grow" placeholder="https://video.thumbnail.here" required />
                                </div>
                            </div>
                        </form>

                        <div className="modal-action" onClick={handleUpdateVideo}>
                            <button type="submit" className="btn btn-accent mr-2">
                                OK
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* Modal for video details and playing*/}
            {playVideo && selectedVideoInfo && <VideoPlayer videoUrl={selectedVideoInfo.url.replace("/view?usp=sharing", "/preview")} onExit={() => setPlayVideo(false)} />}

            <dialog ref={modalRef} id="my_modal_1" className="modal">
                <div className="modal-box">
                    {selectedVideoInfo && (
                        <div className="flex flex-col gap-4">
                            <img src={selectedVideoInfo.thumbnail} alt={selectedVideoInfo.title} className="w-full h-64 object-cover mb- rounded-md" />
                            <h2 className="overVidTitle font-bold">{selectedVideoInfo.title}</h2>
                            <p>
                                <b>Description:</b> {selectedVideoInfo.description}
                            </p>
                            <p>
                                <b>Created by:</b> {selectedVideoInfo.created_by}
                            </p>
                            <p>
                                <b>Released Date:</b> {selectedVideoInfo.uploaded_at}
                            </p>
                        </div>
                    )}

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-primary mr-2" onClick={handlePlayVideo}>
                                Play
                            </button>
                            <button className="btn btn-warning">Close</button>
                            {user && user.role === "admin" && selectedVideoInfo && (
                                <>
                                    <button className="btn btn-secondary ml-2" onClick={() => openUpdateModal(selectedVideoInfo)}>
                                        Update
                                    </button>
                                    <button className="btn btn-error ml-2" onClick={() => handleDeleteVideo(selectedVideoInfo._id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}

Stream.propTypes = {
    user: PropTypes.object.isRequired,
    searchItem: PropTypes.string,
};

export default Stream;
