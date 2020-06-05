import React, { useState, useEffect } from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
interface IMapProps {
  handleGetCoordnate(data?: [number, number]): void;
}

const MapContainer = ({ handleGetCoordnate }: IMapProps) => {
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    setSelectedPosition([lat, lng]);
    handleGetCoordnate([lat, lng]);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);
  return (
    <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={selectedPosition} />
    </Map>
  );
};

export default MapContainer;
