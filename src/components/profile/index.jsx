import { useState, useEffect } from "react";

function AuctionListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userCredits, setUserCredits] = useState(0);
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    // Retrieve user details from local storage
    const storedUserName = localStorage.getItem("user_name");
    const storedUserCredits = localStorage.getItem("user_credits");
    const storedUserAvatar = localStorage.getItem("user_avatar");

    if (storedUserName && storedUserCredits && storedUserAvatar) {
      setUserName(storedUserName);
      setUserCredits(storedUserCredits);
      setUserAvatar(storedUserAvatar);
    }
  }, []);

  useEffect(() => {
    // Retrieve the username from local storage
    const userName = localStorage.getItem("user_name");

    // Ensure that userName is not null or undefined
    if (!userName) {
      console.error("No user name found in local storage.");
      setLoading(false);
      return;
    }

    // Fetch listings for the specific user
    fetch(
      `https://api.noroff.dev/api/v1/auction/profiles/${userName}/listings`,
      {
        headers: {
          // Include your authentication token here
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            console.error("Unauthorized. Please log in.");
          } else {
            console.error(`Request failed with status: ${response.status}`);
          }
          throw new Error("API request failed.");
        }
        return response.json();
      })
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleChangeAvatar = () => {
    // Here you can implement logic to change the avatar URL and update it in local storage.
    const newAvatar = prompt("Enter the new avatar URL:");
    if (newAvatar) {
      localStorage.setItem("user_avatar", newAvatar);
      setUserAvatar(newAvatar);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Profile</h2>
          <div className="flex items-center mt-2">
            <img
              className="w-10 h-10 rounded-full mr-2"
              src={userAvatar}
              alt={`${userName}'s Avatar`}
            />
            <div>
              <p className="font-semibold">{userName}</p>
              <p className="text-gray-600">Credits: {userCredits}</p>
            </div>
          </div>
        </div>
        <div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleChangeAvatar}
          >
            Change Avatar
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white-100 p-6 rounded-md border-2 border-blue-300"
            >
              <img
                className="mt-4"
                src={listing.media[0]}
                alt={listing.title}
              />
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
      ) : (
        <p>No listings available.</p>
      )}
    </div>
  );
}

export default AuctionListings;
