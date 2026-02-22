import { useState } from "react";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

export default function AttachmentUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploaded = await uploadToCloudinary(file);
      onUpload(uploaded); // send metadata to parent
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
