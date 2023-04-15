import React from "react";
import { render, screen } from "@testing-library/react";
import Map from "../components/Map";

// Mock the Google Maps API
jest.mock("@react-google-maps/api", () => ({
  GoogleMap: (props) => <div data-testid="google-map" />,
  Marker: (props) => <div data-testid="marker" />,
  StreetViewPanorama: (props) => <div data-testid="street-view" />,
  DistanceMatrixService: () => null,
  useLoadScript: () => ({ isLoaded: true, loadError: null }),
}));

describe("Map", () => {
  it("renders a Google Map", () => {
    render(<Map />);
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
  });

  it("renders markers on the map", () => {
    const markers = [
      { key: 1, lat: 49.2827, lng: -123.1207 },
      { key: 2, lat: 49.2828, lng: -123.1208 },
    ];
    render(<Map markers={markers} />);
    expect(screen.getAllByTestId("marker")).toHaveLength(2);
  });

  it("displays a street view when a marker is clicked", () => {
    const markers = [{ key: 1, lat: 49.2827, lng: -123.1207 }];
    render(<Map markers={markers} />);
    const marker = screen.getByTestId("marker");
    marker.click();
    expect(screen.getByTestId("street-view")).toBeInTheDocument();
  });
});
