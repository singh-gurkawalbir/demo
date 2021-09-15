import React from 'react';

export default function HeroImages() {
  const path = 'https://www.celigo.com/wp-content/uploads/home-hero.svg';

  return (
    <div>
      <iframe src={path} title="Celigo" />
    </div>
  );
}
