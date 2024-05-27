import React from "react";

const SignUpPage = () => {
    return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {userProfile && (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div>
              <img id="profile-image" src="" alt="Profile Image"/>
              {(imagePresent && isEditing) && <button type="button" id='image-delete' onClick={handleDeleteImage}>Delete Image</button>}
              {isEditing && <input
                  type="file"
                  id="image"
                  name="image"
                  ref={image_ref}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />}
            </div>
            <div>
              <label htmlFor="first_name">First Name:</label>
              <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  ref={first_name_ref}
                  value={userProfile.first_name}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="last_name">Last Name:</label>
              <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={userProfile.last_name}
                  ref={last_name_ref}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="age">Age:</label>
              <input
                  type="number"
                  id="age"
                  name="age"
                  ref={age_ref}
                  value={userProfile.age}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="mail">Email:</label>
              <input
                  type="email"
                  id="mail"
                  name="mail"
                  ref={mail_ref}
                  value={userProfile.mail}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="phone_number">Phone Number:</label>
              <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  ref={phone_number_ref}
                  value={userProfile.phone_number}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
              />
            </div>
            <div id="mapid" style={{height: '200px', width: '100%'}}></div>
            <div className="button-container">
              {isEditing ? (
                  <button type="button" onClick={handleCancelClick}>Cancel</button>
              ) : (
                  <button type="button" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
              {isEditing && <button type="submit">Save Changes</button>}
            </div>
          </form>
      )}
    </div>
  );
};

}