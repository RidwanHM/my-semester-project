import { useState, useEffect } from "react";

function AuctionListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userCredits, setUserCredits] = useState(0);
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
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
    const userName = localStorage.getItem("user_name");

    if (!userName) {
      console.error("No user name found in local storage.");
      setLoading(false);
      return;
    }

    fetch(
      `https://api.noroff.dev/api/v1/auction/profiles/${userName}/listings`,
      {
        headers: {
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

  const handleChangeAvatar = async () => {
    const newAvatar = prompt("Enter the new avatar URL:");
    if (newAvatar) {
      try {
        const endpoint = `https://api.noroff.dev/api/v1/auction/profiles/${userName}/media`;

        const response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ avatar: newAvatar }),
        });

        if (!response.ok) {
          throw new Error("Failed to update avatar");
        }

        const updatedProfile = await response.json();

        localStorage.setItem("user_avatar", updatedProfile.avatar);
        setUserAvatar(updatedProfile.avatar);
      } catch (error) {
        console.error("Error updating avatar:", error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="p-4 w-full max-w-2xl bg-white rounded-lg shadow-md py-6 px-4">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Your Profile
          </h2>
          <div className="flex items-center justify-center mt-4">
            <img
              className="w-16 h-16 rounded-full border-2 border-blue-500 mr-4"
              src={userAvatar}
              alt={`${userName}'s Avatar`}
            />
            <div>
              <p className="font-semibold text-lg text-black">{userName}</p>
              <p className="text-gray-600">Credits: {userCredits}</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors duration-200"
            onClick={handleChangeAvatar}
          >
            Change Avatar
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : listings.length > 0 ? (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 py-6 px-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white p-6 rounded-md border-2 border-blue-300"
            >
              <img
                className="mt-4"
                src={listing.media[0]}
                alt={listing.title}
              />
              <a href={`/listings/?id=${listing.id}`}>
                <h1 className="text-2xl font-bold mb-2 text-black overflow-hidden whitespace-nowrap text-overflow-ellipsis">
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
