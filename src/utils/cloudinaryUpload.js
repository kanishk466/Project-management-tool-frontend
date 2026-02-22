

 export const uploadToCloudinary = async (
  file
) => {
  const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset ='pms_ticket_uploads';
//   console.log("cloudName",cloudName);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "rpm/sprints");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/du16pkes3/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();

  console.table({ file:file,data:data ,fileUrl: data.secure_url, publicId: data.public_id});

  return {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    fileUrl: data.secure_url,
    publicId: data.public_id,
  };
};
