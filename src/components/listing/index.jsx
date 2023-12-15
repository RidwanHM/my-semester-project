import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import PropTypes from "prop-types";

const baseURL = "https://api.noroff.dev/api/v1";

export default function AuctionListingForm({ onAddListing }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [mediaUrls, setMediaUrls] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("access_token");
      const formattedTags = tags.split(",").map((tag) => tag.trim());
      const formattedMediaUrls = mediaUrls.split(",").map((url) => url.trim());

      const response = await fetch(`${baseURL}/auction/listings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          tags: formattedTags,
          media: formattedMediaUrls,
          endsAt,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newListing = await response.json();

      // Call onAddListing if it is a function
      if (typeof onAddListing === "function") {
        onAddListing(newListing);
      }

      // Set success message
      setSuccessMessage("Listing created successfully!");

      // After a short delay, reload the page
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3 seconds delay
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-full px-4 py-6 bg-custom lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6  sm:mx-auto sm:w-full sm:max-w-sm"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="mediaUrls"
            className="block text-sm font-medium text-gray-700"
          >
            Media URLs (comma-separated)
          </label>
          <input
            type="text"
            id="mediaUrls"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={mediaUrls}
            onChange={(e) => setMediaUrls(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="endsAt"
            className="block text-sm font-medium text-gray-700"
          >
            Ends At
          </label>
          <input
            type="datetime-local"
            id="endsAt"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Listing
          </button>
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </div>
      </form>
    </div>
  );
}

AuctionListingForm.propTypes = {
  onAddListing: PropTypes.func, // Remove `.isRequired`
};
