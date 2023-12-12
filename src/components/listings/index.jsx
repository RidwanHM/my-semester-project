import { useEffect, useState } from "react";

export default function ListingDetail() {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [userCredits, setUserCredits] = useState(0);
  const [highestBid, setHighestBid] = useState(0); // State to track the highest bid

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);

        // Use URLSearchParams to get the listing ID from the query string
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get("id");

        // Include the _bids query parameter in the request URL
        const response = await fetch(
          `https://api.noroff.dev/api/v1/auction/listings/${id}?_bids=true`
        );
        if (!response.ok) throw new Error("Data fetch failed");
        const data = await response.json();
        setListing(data);

        // Load user credits from localStorage and set it to state
        const credits = parseInt(localStorage.getItem("user_credits"), 10) || 0;
        setUserCredits(credits);

        // Calculate the highest bid
        const highestBidValue =
          data.bids && data.bids.length > 0
            ? Math.max(...data.bids.map((bid) => bid.amount))
            : 0;
        setHighestBid(highestBidValue);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, []);

  const handleBid = async () => {
    // ... existing handleBid logic

    // Update the user credits and highest bid after a successful bid
    try {
      // ... existing fetch logic for placing a bid

      alert("Bid placed successfully!");

      // Update user credits in both state and localStorage
      const newCredits = userCredits - Number(bidAmount);
      setUserCredits(newCredits);
      localStorage.setItem("user_credits", newCredits.toString());

      // Update highest bid
      setHighestBid(Math.max(highestBid, Number(bidAmount)));
    } catch (err) {
      setError(err.message);
    }
  };

  // ... existing rendering logic

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-80">
      {listing && (
        <div className="bg-white-100 p-20 rounded-md border-2 border-white-300">
          <img className="mt-1" src={listing.media[0]} alt={listing.title} />
          <h1 className="text-2xl font-bold mb-2 text-red overflow-hidden whitespace-nowrap text-overflow-ellipsis">
            {listing.title}
          </h1>
          <p className="text-gray-700 mb-4">{listing.description}</p>
          <p className="text-gray-600">
            Ends at: {new Date(listing.endsAt).toLocaleString()}
          </p>
          <p className="text-gray-600">Bids: {listing._count.bids}</p>
          <p className="text-gray-600">Highest Bid: {highestBid}</p>
          <p className="text-gray-600">Your Credits: {userCredits}</p>
          <div>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
              className="input input-bordered w-full max-w-xs"
            />
            <button onClick={handleBid} className="btn btn-primary">
              Place Bid
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
