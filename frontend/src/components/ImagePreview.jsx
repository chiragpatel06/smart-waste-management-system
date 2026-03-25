import "./ImagePreview.css";
import CloseButton from "./CloseButton";

function ImagePreview({ image, onClose }) {

  if (!image) return null;

  return (
    <div className="image-preview-overlay" onClick={onClose}>
      <div
        className="image-preview-box"
        onClick={(e) => e.stopPropagation()}
      >

        <CloseButton onClick={onClose} />

        <img
          src={image}
          alt="Preview"
          className="image-preview-img"
        />

      </div>
    </div>
  );
}

export default ImagePreview;