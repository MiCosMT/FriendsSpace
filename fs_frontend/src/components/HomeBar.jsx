// Barra de navegación secundaria utilizada en algunas vistas
// Facilita la navegación rápida o muestra el logo de la aplicación
// Barra de navegación secundaria utilizada en algunas vistas (como edición de perfil de primer ingreso)
// Facilita la navegación rápida y muestra el logo y nombre de la aplicación
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { checkSession } from "../utils/checkSession";

export default function HomeBar() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    async function check() {
      const res = await checkSession();
      setIsAuth(res.isAuth);
    }
    check();
  }, []);

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Avatar
            alt="Logo de Friends Space"
            src="/logo.png"
            sx={{ marginRight: 2 }}
          />
        </Link>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Friends Space
        </Typography>

        {isAuth ? (
          <Button
            variant="contained"
            component={Link}
            to="/app/searchnewfriends"
            sx={{ bgcolor: "#50C2AF" }}
          >
            Acceder a mi cuenta
          </Button>
        ) : (
          <Button variant="outlined" component={Link} to="/login">
            Iniciar sesión
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}