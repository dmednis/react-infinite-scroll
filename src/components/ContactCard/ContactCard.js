import React from 'react';
import './ContactCard.css';


export default function ContactCard({ data }) {
  const { avatar, fullName, phone, email, bio, id } = data;
  return (
    <div className='contact-card'>
      <img className='contact-avatar' src={avatar} alt="avatar"/>
      <div className='contact-info'>
        <dl>
          <dt>Full name</dt>
          <dd>{fullName} ({id})</dd>
          <dt>Phone</dt>
          <dd>{phone}</dd>
          <dt>Email</dt>
          <dd>{email}</dd>
          <dt>Bio</dt>
          <dd>{bio}</dd>
        </dl>
      </div>
    </div>
  );
}