/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
    Card, CardContent, Typography, Button, Grid, Container, Box,
    Link as MuiLink, Chip, Stack, Avatar, Divider, IconButton, Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import { Github, Linkedin, Mail, Globe, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const getTheme = (mode) => createTheme({
    palette: {
        mode,
        background: {
            default: mode === "dark" ? "#181a20" : "#f5f7fa",
            paper: mode === "dark" ? "#23272f" : "#fff"
        },
        text: {
            primary: mode === "dark" ? "#fff" : "#181a20",
            secondary: mode === "dark" ? "#b0b3b8" : "#555"
        },
        primary: {
            main: "#2196f3"
        },
        secondary: {
            main: "#ff4081"
        }
    }
});

export default function Portfolio() {
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [contact, setContact] = useState({ address: "", phone: "", email: "" });
    const [themeMode, setThemeMode] = useState("dark");
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(true);

    const domain = ""
    // const domain = "https://aarumugapandi400267.github.io/Inner-Peace"

    useEffect(() => {
        console.log(profile)
        fetch(profile.profileImage)
            .then((res) => res.blob())
            .then((blob) => {
                setProfileImage(URL.createObjectURL(blob));
            });
    }, [profile])

    useEffect(() => {
        const fetchData = async () => {
            await fetch("data/projects.json").then(res => res.json()).then(setProjects);
            await fetch("data/skills.json").then(res => res.json()).then(setSkills);
            await fetch("data/certifications.json").then(res => res.json()).then(setCertifications);
            await fetch("data/experience.json").then(res => res.json()).then(setExperience);
            await fetch("data/education.json").then(res => res.json()).then(setEducation);
            await fetch("data/contact.json").then(res => res.json()).then(setContact);
            await fetch("data/profile.json").then(res => res.json()).then((data) => { setProfile(data) })
            setLoading(false);
        };
        fetchData();
    }, []);

    const theme = getTheme(themeMode);

    // Set body background according to theme
    React.useEffect(() => {
        document.body.style.backgroundColor = theme.palette.background.default;
        document.body.style.color = theme.palette.text.primary;
    }, [themeMode, theme.palette.background.default, theme.palette.text.primary]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary
                }}
            >
                <CircularProgress color="primary" size={64} />
            </Box>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Container
                maxWidth="lg"
                sx={{
                    py: 10,
                    bgcolor: "background.default",
                    minHeight: "100vh",
                    px: { xs: 2, sm: 4, md: 8 }
                }}
            >
                {/* Theme Switch Button */}
                <Box sx={{ position: "fixed", top: 24, right: 32, zIndex: 1000 }}>
                    <IconButton
                        color="primary"
                        onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
                        aria-label="Toggle theme"
                        size="large"
                    >
                        {themeMode === "dark" ? <Sun /> : <Moon />}
                    </IconButton>
                </Box>
                <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <Box textAlign="center" mb={10}>
                        <Avatar
                            src={profileImage}
                            alt="Profile Photo"
                            sx={{
                                width: 220,
                                height: 220,
                                mx: "auto",
                                mb: 3,
                                border: '3px solid #2196f3'
                            }}
                        />
                        <Typography variant="h3" fontWeight="bold" gutterBottom color="text.primary">
                            {profile.name}
                        </Typography>
                        <Typography variant="h5" color="primary.main" fontWeight="medium">
                            {profile.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mt={2}>
                            {contact.address}<br />{contact.phone} | {contact.email}
                        </Typography>
                        <Stack direction="row" justifyContent="center" spacing={3} mt={3}>
                            <MuiLink href={`mailto:${contact.email}`} target="_blank" color="inherit">
                                <Mail color={themeMode === "dark" ? "#fff" : undefined} />
                            </MuiLink>
                            <MuiLink href={profile.social.github} target="_blank" color="inherit">
                                <Github color={themeMode === "dark" ? "#fff" : undefined} />
                            </MuiLink>
                            <MuiLink href={profile.social.linkedin} target="_blank" color="inherit">
                                <Linkedin color={themeMode === "dark" ? "#fff" : undefined} />
                            </MuiLink>
                            <MuiLink href={profile.social.website} target="_blank" color="inherit">
                                <Globe color={themeMode === "dark" ? "#fff" : undefined} />
                            </MuiLink>
                        </Stack>
                    </Box>
                </motion.div>

                <Divider sx={{ my: 5, bgcolor: "primary.main" }} />

                {/* Experience */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ staggerChildren: 0.2 }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box component="section" mb={10}>
                            <Typography variant="h4">Experience</Typography>
                            <Stack spacing={4} mt={2}>
                                {experience.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    >
                                        <Box p={2} borderRadius={2} bgcolor="background.paper">
                                            <Grid container spacing={2}>
                                                {/* Company logo (first image) */}
                                                <Grid item>
                                                    <Avatar
                                                        src={item.companylogo || ""}
                                                        alt={item.company}
                                                        sx={{ width: 64, height: 64 }}
                                                    />
                                                </Grid>

                                                {/* Role + Company Info */}
                                                <Grid item xs>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {item.role}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <MuiLink
                                                            href={item.companyUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            sx={{ color: "inherit", textDecoration: "none" }}
                                                        >
                                                            {item.company}
                                                        </MuiLink>{" "}
                                                        · Internship
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.duration}
                                                    </Typography>
                                                    {item.location && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.location}
                                                        </Typography>
                                                    )}

                                                    {/* Skills compact display */}
                                                    {item.skills && item.skills.length > 0 && (
                                                        <Typography variant="body2" mt={1}>
                                                            {item.skills.slice(0, 2).join(", ")}{" "}
                                                            {item.skills.length > 2 &&
                                                                `and +${item.skills.length - 2} skills`}
                                                        </Typography>
                                                    )}
                                                </Grid>
                                            </Grid>

                                            {/* Preview images row */}
                                            {item.images && item.images.length > 1 && (
                                                <ImageGallery images={item.images} />
                                            )}
                                        </Box>
                                    </motion.div>
                                ))}
                            </Stack>
                        </Box>
                    </motion.div>
                </motion.div>

                {/* Certifications */}
                {certifications.length != 0 && <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <Box component="section" mb={10}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
                            Certifications
                        </Typography>
                        <Stack spacing={3}>
                            {certifications.map((cert, idx) => (
                                <Box key={idx}>
                                    <Typography variant="body1" fontWeight="medium" color="text.primary">
                                        {cert.title} – {cert.issuer}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {cert.date}
                                    </Typography>
                                    {cert.url && (
                                        <MuiLink href={cert.url} target="_blank" rel="noopener noreferrer" color="primary">
                                            View Certificate
                                        </MuiLink>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </motion.div>}

                {/* Projects */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <Box component="section" mb={10}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom align="center" color="text.primary">
                            Featured Projects
                        </Typography>
                        <Grid container spacing={4}>
                            {projects.map((project, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index} width="100%">
                                    <Card sx={{
                                        height: "100%",
                                        borderLeft: "5px solid #1976d2",
                                        bgcolor: "background.paper",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                                                {project.title}
                                                {project.repo && (
                                                    <IconButton
                                                        color="primary"
                                                        sx={{ mt: 1, color: "#2196f3" }}
                                                        href={project.repo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label="GitHub Repository"
                                                    >
                                                        <Github color={themeMode === "dark" ? "#fff" : undefined} />
                                                    </IconButton>
                                                )}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {project.description}
                                            </Typography>
                                            {/* Show status chip if available */}
                                            {project.status && (
                                                <Chip
                                                    label={project.status}
                                                    color={project.status === "Completed" ? "success" : "warning"}
                                                    size="small"
                                                    sx={{ mb: 1 }}
                                                />
                                            )}

                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </motion.div>

                {/* Skills */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <Box component="section" mb={10}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
                            Skills
                        </Typography>
                        <Grid container spacing={3} sx={{ display: "flex", flexDirection: "column" }}>
                            {skills.map((skill, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls={`panel${idx}-content`}
                                            id={`panel${idx}-header`}
                                        >
                                            <Typography variant="body1" fontWeight="medium" color="text.primary">
                                                {skill.name} {skill.level && `– ${skill.level}`}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {(skill.keywords || []).map((keyword, kIdx) => (
                                                    <Chip
                                                    key={kIdx}
                                                        label={keyword}
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </motion.div>

                {/* Contact */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <img src={profile?.banner} style={{width:"100%"}} alt="" />
                        <Box textAlign="center">
                            <br />
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            href={`mailto:${contact.email}`}
                        >
                            Contact Me
                            {/* {profile.buttons.contactMe} */}
                        </Button>
                    </Box>
                </motion.div>
            </Container>
        </ThemeProvider>
    );
}

// Add this helper component at the bottom of your file (before export default)
function ImageGallery({ images }) {
    const [selected, setSelected] = React.useState(null);

    // Close the modal on ESC
    React.useEffect(() => {
        if (selected === null) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setSelected(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selected]);

    const handlePrev = (e) => {
        e.stopPropagation();
        setSelected((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setSelected((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // Initial row view
    if (selected === null) {
        return (
            <Stack direction="row" spacing={2} mt={2}>
                {images.map((imgObj, imgIdx) => (
                    <Box
                        key={imgIdx}
                        onClick={() => setSelected(imgIdx)}
                        sx={{
                            width: 120,
                            height: 80,
                            borderRadius: 2,
                            overflow: "hidden",
                            cursor: "pointer",
                            boxShadow: 2,
                            border: "2px solid transparent",
                            transition: "box-shadow 0.2s, border 0.2s",
                            "&:hover": {
                                boxShadow: 6,
                                border: "2px solid #2196f3"
                            }
                        }}
                    >
                        <Box
                            component="img"
                            src={imgObj.image}
                            alt={`preview-${imgIdx}`}
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 2
                            }}
                        />
                    </Box>
                ))}
            </Stack>
        );
    }

    // Modal view
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                bgcolor: "rgba(0,0,0,0.85)",
                zIndex: 2000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            onClick={() => setSelected(null)}
        >
            <Box
                sx={{
                    position: "relative",
                    width: { xs: "95vw", sm: "80vw", md: "60vw", lg: "50vw" },
                    maxWidth: 800,
                    maxHeight: "80vh",
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    boxShadow: 24,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <IconButton
                    onClick={() => setSelected(null)}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        zIndex: 2,
                        "&:hover": { bgcolor: "primary.main" }
                    }}
                    aria-label="Close"
                >
                    ×
                </IconButton>
                {/* Image */}
                <Box
                    component="img"
                    src={images[selected].image}
                    alt={`modal-preview-${selected}`}
                    sx={{
                        width: "100%",
                        height: { xs: 220, sm: 350, md: 400 },
                        objectFit: "contain",
                        bgcolor: "#222",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        flexShrink: 0
                    }}
                />
                {/* Subtitle */}
                {images[selected].subtitle && (
                    <Box
                        sx={{
                            width: "100%",
                            bgcolor: "rgba(33,150,243,0.15)",
                            color: "primary.main",
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                            fontSize: 16,
                            textAlign: "center",
                            borderBottom: "1px solid #2196f3"
                        }}
                    >
                        {images[selected].subtitle}
                    </Box>
                )}
                {/* Description */}
                <Box
                    sx={{
                        width: "100%",
                        bgcolor: "rgba(0,0,0,0.85)",
                        color: "#fff",
                        px: 3,
                        py: 2,
                        fontSize: 17,
                        textAlign: "center",
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12
                    }}
                >
                    {images[selected].description}
                </Box>
                {/* Prev Button */}
                <IconButton
                    onClick={handlePrev}
                    sx={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        "&:hover": { bgcolor: "primary.main" },
                        zIndex: 3
                    }}
                    size="large"
                    aria-label="Previous image"
                >
                    <ChevronLeft size={32} />
                </IconButton>
                {/* Next Button */}
                <IconButton
                    onClick={handleNext}
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        "&:hover": { bgcolor: "primary.main" },
                        zIndex: 3
                    }}
                    size="large"
                    aria-label="Next image"
                >
                    <ChevronRight size={32} />
                </IconButton>
                {/* Counter */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 10,
                        right: 24,
                        color: "#fff",
                        fontSize: 14,
                        opacity: 0.7
                    }}
                >
                    {selected + 1} / {images.length}
                </Box>
            </Box>
        </Box>
    );
}
