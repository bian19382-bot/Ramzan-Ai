import React from 'react';

interface CollidingSparksBurstProps {
  className?: string;
  count?: number;
}

// Replaced legacy particle burst with inert no-op to adhere to Alter Ego clean cinematic motion system
export const CollidingSparksBurst: React.FC<CollidingSparksBurstProps> = () => {
  return null;
};
