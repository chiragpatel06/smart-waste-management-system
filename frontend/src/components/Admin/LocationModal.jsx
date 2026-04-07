import React from 'react';
import { X, MapPin } from 'lucide-react';
import './LocationModal.css';

const LocationModal = ({ address, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOpenMaps = () => {
    if (!address) return;
    const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="location-modal-overlay" onClick={onClose}>
      <div className="location-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="location-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="location-modal-header">
          <div className="location-icon-wrapper">
            <MapPin size={24} className="location-icon" />
          </div>
          <h3>Location Details</h3>
        </div>
        <div className="location-modal-body">
          <p className="full-address-text">{address || "No address provided."}</p>
        </div>
        <div className="location-modal-footer">
          <button className="google-maps-btn" onClick={handleOpenMaps} disabled={!address}>
            Open in Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
