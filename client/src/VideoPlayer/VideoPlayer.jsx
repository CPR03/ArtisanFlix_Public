import PropTypes from 'prop-types';
import "./VideoPlayer.css";

function VideoPlayer({ videoUrl, onExit }) {
    return (
        <div className="video-player z-20">

            { /* Exit button */}
            <button className="exit-button btn btn-sm btn-circle btn-base-content flex justify-center items-center" onClick={onExit}>✖</button>

            { /* Video player */}
            <iframe src={videoUrl} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}

VideoPlayer.propTypes = {
    videoUrl: PropTypes.string.isRequired,
    onExit: PropTypes.func.isRequired
};

export default VideoPlayer;