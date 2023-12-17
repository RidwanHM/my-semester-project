import { useEffect, useState } from "react";

export default function ListingDetail() {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [userCredits, setUserCredits] = useState(0);
  const [highestBid, setHighestBid] = useState(0);

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {
    try {
      setIsLoading(true);
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `https://api.noroff.dev/api/v1/auction/listings/${id}?_bids=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Data fetch failed");
      const data = await response.json();

      setListing(data);
      setUserCredits(parseInt(localStorage.getItem("user_credits"), 10) || 0);
      setHighestBid(
        data.bids && data.bids.length > 0
          ? Math.max(...data.bids.map((bid) => bid.amount))
          : 0
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validateBid = () => {
    const bidValue = Number(bidAmount);
    if (isNaN(bidValue) || bidValue <= 0) {
      setError("Invalid bid amount");
      return false;
    }
    if (bidValue > userCredits) {
      setError("Bid exceeds your credit limit");
      return false;
    }
    if (bidValue <= highestBid) {
      setError("Bid must be higher than the current highest bid");
      return false;
    }
    if (new Date(listing.endsAt) < new Date()) {
      setError("This listing has ended");
      return false;
    }
    return true;
  };

  const submitBid = async () => {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/listings/${listing.id}/bids`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(bidAmount) }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to place bid");
    }
  };

  const handleBid = async () => {
    if (!validateBid()) return;

    try {
      await submitBid();

      const newCredits = userCredits - Number(bidAmount);
      localStorage.setItem("user_credits", newCredits.toString());
      setUserCredits(newCredits);

      alert("Bid placed successfully!");

      window.location.reload();
    } catch (err) {
      setError(`Failed to place bid: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error: {error}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 bg-white lg:px-8">
      {listing && (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <img
            className="rounded-md mb-4"
            src={listing.media[0]}
            alt={listing.title}
          />
          <h1 className="text-2xl font-bold mb-2 text-black">
            {listing.title}
          </h1>
          <p className="text-gray-700 mb-4">{listing.description}</p>
          <p className="text-gray-600">
            Ends at: {new Date(listing.endsAt).toLocaleString()}
          </p>
          <p className="text-gray-600">Bids: {listing._count.bids}</p>
          <p className="text-gray-600">Highest Bid: {highestBid}</p>
          <p className="text-gray-600">Your Credits: {userCredits}</p>
          <div className="mt-4">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
              className="px-1 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
            />
            <button
              onClick={handleBid}
              className="mt-2 flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Place Bid
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
