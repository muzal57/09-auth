"use client";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div style={{ padding: "2rem" }}>
      <p>Could not fetch the list of notes. {error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
};

export default Error;
