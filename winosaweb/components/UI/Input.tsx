"use client";

type InputProps = {
  placeholder?: string;
  type?: string;
};

export default function Input({ placeholder, type = "text" }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: "12px",
        border: "1.5px solid #000",
        fontSize: "14px",
        outline: "none",
      }}
      onFocus={(e) => {
        e.currentTarget.style.border = "1.5px solid #000";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.15)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.border = "1.5px solid #000";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  );
}
