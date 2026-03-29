import API from "./api";

export const initiateCall = async (data: { phone: string; course: string; topic: string }) => {
  const res = await API.post("/vapi/call", {
    phoneNumber: data.phone,
    preferredCourse: `${data.course} - ${data.topic}`,
  });
  return res.data;
};
