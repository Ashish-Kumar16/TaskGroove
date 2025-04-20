// src/components/CleanThemeProvider.jsx
import React from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";

const CleanThemeProvider = ({ children, ...props }) => {
  const cleanProps = Object.fromEntries(
    Object.entries(props).filter(
      ([key]) =>
        !key.startsWith("data-lov-") && !key.startsWith("data-component-"),
    ),
  );
  return <MuiThemeProvider {...cleanProps}>{children}</MuiThemeProvider>;
};

export default CleanThemeProvider;
