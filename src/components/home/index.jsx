import { useState, useEffect } from "react";

export default function Homefetch() {
  const [auctionListings, setAuctionListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // API URL with sorting parameters
    const apiUrl =
      "https://api.noroff.dev/api/v1/auction/listings?sort=created&sortOrder=desc";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setAuctionListings(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Filter the listings based on the search query
  const filteredListings = auctionListings.filter((listing) =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search listings..."
        className="mb-4 p-2 border border-gray-300 rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white-100 p-6 rounded-md border-2 border-blue-300"
          >
            <img className="mt-4" src={listing.media[0]} alt={listing.title} />
            <a href={`/listings/?id=${listing.id}`}>
              <h1 className="text-2xl font-bold mb-2 text-white overflow-hidden whitespace-nowrap text-overflow-ellipsis">
                {listing.title}
              </h1>
            </a>
            <p className="text-gray-700 mb-4">{listing.description}</p>
            <p className="text-gray-600">
              Ends at: {new Date(listing.endsAt).toLocaleString()}
            </p>
            <p className="text-gray-600">Bids: {listing._count.bids}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
