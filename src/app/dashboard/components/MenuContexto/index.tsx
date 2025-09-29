"use client";
import { useEffect } from "react";

import "./MenuContexto.css";

interface MenuContextoProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  options: { label: string; onClick: () => void }[];
}

export default function MenuContexto({ x, y, visible, onClose, options }: MenuContextoProps) {
  useEffect(() => {
    const handleClickOutside = () => onClose();
    if (visible) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <ul
      className="context-menu"
      style={{ top: y, left: x, position: "absolute" }}
    >
      {options.map((opt, idx) => (
        <li
          key={idx}
          className="context-menu-item"
          onClick={() => {
            opt.onClick();
            onClose();
          }}
        >
          {opt.label}
        </li>
      ))}
    </ul>
  );
}