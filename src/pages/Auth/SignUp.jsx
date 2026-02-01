import React from "react";
import { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATH } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
import uploadImage from "../../utils/uploadImage";
import { validateEmail } from "../../utils/helper";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setadminInviteToken] = useState("");
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = ""
    // Reset error terlebih dahulu
    setError("");

    if (!fullName) {
      setError("Please enter full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    // Jika semua validasi lolos
    setError("");
    // api call
    try {
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic)
        profileImageUrl = imgUploadRes.imageUrl || ""
      }
      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        // redirect berdasarkan role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again");
      }
    }
  };
  return (
    <AuthLayout>
      <div>
        <h3>Create an account</h3>
        <p>Join us today by entering your details below</p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div>
            <Input
              type="text"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Input
              value={adminInviteToken}
              onChange={({ target }) => setadminInviteToken(target.value)}
              label="admin Invite Token"
              placeholder="8 Digit Code"
              type="text"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Sign In
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            Have An Account?{" "}
            <span
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
