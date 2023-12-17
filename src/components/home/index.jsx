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
    <div className="mx-auto bg-white p-4">
      <input
        type="text"
        placeholder="Search listings..."
        className="mb-4 p-3 border border-gray-300 text-gray rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {filteredListings.map((listing) => (
          <a
            key={listing.id}
            href={`/listings/?id=${listing.id}`}
            className="bg-white-100 p-6 rounded-md border-2 border-blue-300 block"
          >
            <img className="mt-4" src={listing.media[0]} alt={listing.title} />
            <h1 className="text-2xl font-bold mb-2 text-black overflow-hidden whitespace-nowrap text-overflow-ellipsis">
              {listing.title}
            </h1>
            <p className="text-gray-600">
              Ends at: {new Date(listing.endsAt).toLocaleString()}
            </p>
            <p className="text-gray-600">Bids: {listing._count.bids}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
