import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Link as MuiLink,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import {
  Award,
  BookOpenText,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  Moon,
  Phone,
  Sun,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const dataFiles = {
  projects: "data/projects.json",
  skills: "data/skills.json",
  certifications: "data/certifications.json",
  experience: "data/experience.json",
  education: "data/education.json",
  research: "data/research.json",
  publications: "data/publications.json",
  contact: "data/contact.json",
  profile: "data/profile.json",
};

const emptyData = {
  projects: [],
  skills: [],
  certifications: [],
  experience: [],
  education: [],
  research: [],
  publications: [],
  contact: {},
  profile: { social: {}, sections: {}, buttons: {} },
};

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      background: {
        default: mode === "dark" ? "#0f172a" : "#f8fafc",
        paper: mode === "dark" ? "#111827" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#f8fafc" : "#0f172a",
        secondary: mode === "dark" ? "#cbd5e1" : "#475569",
      },
      primary: {
        main: "#38bdf8",
      },
      secondary: {
        main: "#14b8a6",
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
  });

const sectionMotion = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.45 },
};

const MotionDiv = motion.div;
const MotionSection = motion.section;

export default function Portfolio() {
  const [data, setData] = useState(emptyData);
  const [themeMode, setThemeMode] = useState("dark");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);
  const { projects, skills, certifications, experience, education, research, publications, contact, profile } = data;
  const social = profile.social || {};

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const entries = await Promise.all(
          Object.entries(dataFiles).map(async ([key, path]) => {
            const response = await fetch(path);
            if (!response.ok) {
              throw new Error(`Failed to load ${path}`);
            }
            return [key, await response.json()];
          })
        );

        if (isMounted) {
          setData({ ...emptyData, ...Object.fromEntries(entries) });
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
  }, [theme]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            bgcolor: "background.default",
          }}
        >
          <CircularProgress color="primary" size={64} />
        </Box>
      </ThemeProvider>
    );
  }

  if (loadError) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            bgcolor: "background.default",
            color: "text.primary",
            px: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">{loadError}</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <IconButton
          color="primary"
          onClick={() => setThemeMode((mode) => (mode === "dark" ? "light" : "dark"))}
          aria-label="Toggle theme"
          sx={{
            position: "fixed",
            top: 20,
            right: 24,
            zIndex: 1000,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            "&:hover": { bgcolor: "background.paper" },
          }}
        >
          {themeMode === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </IconButton>

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 }, px: { xs: 2.5, sm: 4 } }}>
          <Hero profile={profile} contact={contact} social={social} themeMode={themeMode} />

          <Divider sx={{ my: { xs: 6, md: 8 }, borderColor: "primary.main" }} />

          <ExperienceSection items={experience} />
          <ProjectsSection projects={projects} />
          <ResearchSection research={research} />
          <PublicationsSection publications={publications} />
          <SkillsSection skills={skills} />
          <EducationSection education={education} />
          <CertificationsSection certifications={certifications} />
          <ContactSection profile={profile} contact={contact} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

function Hero({ profile, contact, social, themeMode }) {
  const links = [
    { label: "Email", href: contact.email ? `mailto:${contact.email}` : "", icon: Mail },
    { label: "GitHub", href: social.github || contact.github, icon: Github },
    { label: "LinkedIn", href: social.linkedin || contact.linkedin, icon: Linkedin },
    { label: "Website", href: social.website, icon: Globe },
  ].filter((link) => link.href);

  return (
    <MotionDiv initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
      <Grid container spacing={5} alignItems="center">
        <Grid item xs={12} md={4}>
          <Box textAlign={{ xs: "center", md: "left" }}>
            <Avatar
              src={profile.profileImage}
              alt={profile.name || "Profile photo"}
              sx={{
                width: { xs: 180, sm: 220 },
                height: { xs: 180, sm: 220 },
                mx: { xs: "auto", md: 0 },
                border: "4px solid",
                borderColor: "primary.main",
                boxShadow: "0 24px 60px rgba(56, 189, 248, 0.22)",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack spacing={2.5} alignItems={{ xs: "center", md: "flex-start" }} textAlign={{ xs: "center", md: "left" }}>
            <Chip label="AI Research | Robotics | Intelligent Computation" color="primary" variant="outlined" />
            <Box>
              <Typography variant="h2" component="h1" fontWeight={800} sx={{ fontSize: { xs: 38, md: 58 } }}>
                {profile.name}
              </Typography>
              <Typography variant="h5" color="primary.main" fontWeight={600} mt={1}>
                {profile.title}
              </Typography>
            </Box>
            {profile.contactText && (
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, fontSize: 18 }}>
                {profile.contactText}
              </Typography>
            )}
            <Stack direction="row" spacing={1.5} flexWrap="wrap" justifyContent={{ xs: "center", md: "flex-start" }}>
              {contact.phone && <ContactPill icon={Phone} label={contact.phone} />}
              {contact.email && <ContactPill icon={Mail} label={contact.email} href={`mailto:${contact.email}`} />}
            </Stack>
            <Stack direction="row" spacing={2} justifyContent={{ xs: "center", md: "flex-start" }}>
              {links.map(({ label, href, icon: Icon }) => (
                <IconButton
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={label}
                  sx={{
                    color: themeMode === "dark" ? "#f8fafc" : "text.primary",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {React.createElement(Icon, { size: 22 })}
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </MotionDiv>
  );
}

function ContactPill({ icon: Icon, label, href }) {
  const content = (
    <Chip
      icon={React.createElement(Icon, { size: 16 })}
      label={label}
      variant="outlined"
      sx={{ color: "text.secondary", borderColor: "divider", "& .MuiChip-icon": { color: "primary.main" } }}
    />
  );

  if (!href) return content;

  return (
    <MuiLink href={href} underline="none" color="inherit">
      {content}
    </MuiLink>
  );
}

function SectionHeader({ icon: Icon, title, eyebrow }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
      <Box
        sx={{
          width: 42,
          height: 42,
          display: "grid",
          placeItems: "center",
          borderRadius: 2,
          bgcolor: "rgba(56, 189, 248, 0.12)",
          color: "primary.main",
        }}
      >
        {React.createElement(Icon, { size: 22 })}
      </Box>
      <Box>
        {eyebrow && (
          <Typography variant="caption" color="primary.main" fontWeight={700} textTransform="uppercase">
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h4" component="h2" fontWeight={800}>
          {title}
        </Typography>
      </Box>
    </Stack>
  );
}

function ExperienceSection({ items }) {
  if (!items.length) return null;

  return (
    <MotionSection {...sectionMotion}>
      <Box mb={9}>
        <SectionHeader icon={BriefcaseBusiness} title="Experience" eyebrow="Applied AI work" />
        <Stack spacing={3}>
          {items.map((item, idx) => (
            <Card key={`${item.company}-${idx}`} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Grid container spacing={2.5}>
                  <Grid item>
                    {item.company === "Meridian Solutions" ? (
                      <CompanyLogo src={item.companylogo} alt={item.company} />
                    ) : (
                      <Avatar src={item.companylogo || ""} alt={item.company} sx={{ width: 64, height: 64 }} />
                    )}
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6" fontWeight={800}>
                      {item.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <MuiLink href={item.companyUrl} target="_blank" rel="noopener noreferrer" color="inherit" underline="hover">
                        {item.company}
                      </MuiLink>
                      {item.duration ? ` | ${item.duration}` : ""}
                    </Typography>
                    {item.location && (
                      <Typography variant="body2" color="text.secondary">
                        {item.location}
                      </Typography>
                    )}
                    {item.description && (
                      <Typography variant="body1" color="text.secondary" mt={2}>
                        {item.description}
                      </Typography>
                    )}
                    {!!item.skills?.length && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={2}>
                        {item.skills.map((skill) => (
                          <Chip key={skill} label={skill} size="small" color="primary" variant="outlined" />
                        ))}
                      </Stack>
                    )}
                  </Grid>
                </Grid>
                {!!item.images?.length && <ImageGallery images={item.images} />}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </MotionSection>
  );
}

function CompanyLogo({ src, alt }) {
  return (
    <Box
      sx={{
        width: { xs: 104, sm: 126 },
        height: 68,
        display: "grid",
        placeItems: "center",
        bgcolor: "#ffffff",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        p: 1.25,
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.16)",
      }}
    >
      {src ? (
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      ) : (
        <BriefcaseBusiness size={28} color="#0f172a" />
      )}
    </Box>
  );
}

function ProjectsSection({ projects }) {
  if (!projects.length) return null;

  return (
    <MotionSection {...sectionMotion}>
      <Box mb={9}>
        <SectionHeader icon={Github} title="Featured Projects" eyebrow="Research and engineering" />
        <Grid container spacing={3}>
          {projects.map((project, index) => (
            <Grid item xs={12} md={6} key={`${project.title}-${index}`}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderTop: "4px solid",
                  borderTopColor: "primary.main",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                    <Typography variant="h6" fontWeight={800}>
                      {project.title}
                    </Typography>
                    {project.repo && (
                      <IconButton href={project.repo} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} repository`}>
                        <Github size={20} />
                      </IconButton>
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mt={1.5}>
                    {project.description}
                  </Typography>
                  {project.status && <Chip label={project.status} color="secondary" size="small" sx={{ mt: 2 }} />}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MotionSection>
  );
}

function ResearchSection({ research }) {
  if (!research.length) return null;

  return (
    <MotionSection {...sectionMotion}>
      <Box mb={9}>
        <SectionHeader icon={BookOpenText} title="Research & Innovation Projects" eyebrow="Published research" />
        <Grid container spacing={3}>
          {research.map((item, index) => (
            <Grid item xs={12} md={6} key={`${item.title}-${index}`}>
              <Card sx={{ height: "100%", bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="primary.main" fontWeight={700} mt={0.75}>
                        {[item.role, item.venue].filter(Boolean).join(" | ")}
                      </Typography>
                    </Box>
                    {item.status && <Chip label={item.status} color="secondary" size="small" />}
                  </Stack>
                  {item.description && (
                    <Typography variant="body2" color="text.secondary" mt={1.5}>
                      {item.description}
                    </Typography>
                  )}
                  {!!item.highlights?.length && (
                    <Box component="ul" sx={{ color: "text.secondary", pl: 2.5, mt: 1.5, mb: 0 }}>
                      {item.highlights.map((highlight) => (
                        <Typography component="li" variant="body2" key={highlight} sx={{ mb: 1 }}>
                          {highlight}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  {!!item.keywords?.length && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={2}>
                      {item.keywords.map((keyword) => (
                        <Chip key={keyword} label={keyword} color="secondary" variant="outlined" size="small" />
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MotionSection>
  );
}

function PublicationsSection({ publications }) {
  if (!publications.length) return null;

  return (
    <motion.section {...sectionMotion}>
      <Box mb={9}>
        <SectionHeader icon={FileText} title="Publications & IP" eyebrow="Research outputs" />
        <Stack spacing={2}>
          {publications.map((item, index) => (
            <Card key={`${item.title}-${index}`} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={1.5}>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="primary.main" fontWeight={700} mt={0.5}>
                      {[item.type, item.publisher, item.date].filter(Boolean).join(" | ")}
                    </Typography>
                  </Box>
                  {item.status && <Chip label={item.status} color="secondary" size="small" />}
                </Stack>
                {item.description && (
                  <Typography variant="body2" color="text.secondary" mt={1.5}>
                    {item.description}
                  </Typography>
                )}
                {item.url && (
                  <MuiLink href={item.url} target="_blank" rel="noopener noreferrer" color="primary" sx={{ display: "inline-block", mt: 1.5 }}>
                    View reference
                  </MuiLink>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </motion.section>
  );
}

function SkillsSection({ skills }) {
  if (!skills.length) return null;

  return (
    <MotionSection {...sectionMotion}>
      <Box mb={9}>
        <SectionHeader icon={Award} title="Technical Skills" eyebrow="Tooling and methods" />
        <Stack spacing={1.5}>
          {skills.map((skill, index) => (
            <Accordion
              key={skill.name}
              defaultExpanded={index === 0}
              disableGutters
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={20} />}
                aria-controls={`skills-${index}-content`}
                id={`skills-${index}-header`}
                sx={{ px: 2.5, py: 0.5 }}
              >
                <Typography variant="subtitle1" fontWeight={800}>
                  {skill.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(skill.keywords || []).map((keyword) => (
                    <Chip key={keyword} label={keyword} color="primary" variant="outlined" size="small" />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>
    </MotionSection>
  );
}

function EducationSection({ education }) {
  if (!education.length) return null;

  return (
    <MotionSection {...sectionMotion}>
      <Box mb={9}>
        <SectionHeader icon={GraduationCap} title="Education" eyebrow="Academic foundation" />
        <Stack spacing={2.5}>
          {education.map((item, index) => (
            <Card key={`${item.institution}-${index}`} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={800}>
                  {item.degree}
                </Typography>
                <Typography variant="body2" color="primary.main" fontWeight={700}>
                  {item.institution}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {item.duration}
                </Typography>
                {item.details && (
                  <Typography variant="body2" color="text.secondary" mt={1.5}>
                    {item.details}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </MotionSection>
  );
}

function CertificationsSection({ certifications }) {
  if (!certifications.length) return null;

  return (
    <MotionSection {...sectionMotion}>
      <Box mb={9}>
        <SectionHeader icon={Award} title="Certifications" eyebrow="Credentials" />
        <Stack spacing={2}>
          {certifications.map((cert, idx) => (
            <Card key={`${cert.title}-${idx}`} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Typography variant="body1" fontWeight={800}>
                  {cert.title} - {cert.issuer}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cert.date}
                </Typography>
                {cert.url && (
                  <MuiLink href={cert.url} target="_blank" rel="noopener noreferrer" color="primary" sx={{ display: "block", mt: 1 }}>
                    View Certificate
                  </MuiLink>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </MotionSection>
  );
}

function ContactSection({ profile, contact }) {
  return (
    <MotionSection {...sectionMotion}>
      <Box textAlign="center" pb={2}>
        {profile.banner && (
          <Box
            component="img"
            src={profile.banner}
            alt="Portfolio banner"
            sx={{
              width: "100%",
              maxHeight: 320,
              objectFit: "cover",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              mb: 3,
            }}
          />
        )}
        <Typography variant="h4" component="h2" fontWeight={800} mb={1}>
          Let's Build Useful AI
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={680} mx="auto" mb={3}>
          Open to research collaborations, AI product engineering, intelligent computation, robotics, and applied ML opportunities.
        </Typography>
        {contact.email && (
          <Button variant="contained" color="secondary" size="large" href={`mailto:${contact.email}`} startIcon={<Mail size={18} />}>
            Contact Me
          </Button>
        )}
      </Box>
    </MotionSection>
  );
}

function ImageGallery({ images }) {
  const [selected, setSelected] = React.useState(null);

  React.useEffect(() => {
    if (selected === null) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowLeft") setSelected((current) => (current === 0 ? images.length - 1 : current - 1));
      if (event.key === "ArrowRight") setSelected((current) => (current === images.length - 1 ? 0 : current + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, selected]);

  if (!images.length) return null;

  const handlePrev = (event) => {
    event.stopPropagation();
    setSelected((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const handleNext = (event) => {
    event.stopPropagation();
    setSelected((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <>
      <Stack direction="row" spacing={1.5} mt={2.5} sx={{ overflowX: "auto", pb: 1 }}>
        {images.map((imgObj, imgIdx) => (
          <Box
            key={`${imgObj.image}-${imgIdx}`}
            component="button"
            type="button"
            onClick={() => setSelected(imgIdx)}
            aria-label={`Open experience image ${imgIdx + 1}`}
            sx={{
              width: 128,
              height: 84,
              border: "2px solid transparent",
              borderRadius: 2,
              overflow: "hidden",
              cursor: "pointer",
              flex: "0 0 auto",
              p: 0,
              bgcolor: "transparent",
              boxShadow: 2,
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <Box component="img" src={imgObj.image} alt={imgObj.subtitle || `Preview ${imgIdx + 1}`} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </Box>
        ))}
      </Stack>

      {selected !== null && (
        <Box
          role="dialog"
          aria-modal="true"
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(2, 6, 23, 0.9)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
          onClick={() => setSelected(null)}
        >
          <Box
            sx={{
              position: "relative",
              width: "min(920px, 96vw)",
              maxHeight: "88vh",
              bgcolor: "background.paper",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 24,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <IconButton
              onClick={() => setSelected(null)}
              sx={{ position: "absolute", top: 10, right: 10, zIndex: 2, bgcolor: "rgba(15, 23, 42, 0.72)", color: "#fff" }}
              aria-label="Close gallery"
            >
              <X size={20} />
            </IconButton>
            <Box component="img" src={images[selected].image} alt={images[selected].subtitle || "Experience image"} sx={{ width: "100%", maxHeight: "62vh", objectFit: "contain", display: "block", bgcolor: "#020617" }} />
            <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
              {images[selected].subtitle && (
                <Typography variant="subtitle1" color="primary.main" fontWeight={800}>
                  {images[selected].subtitle}
                </Typography>
              )}
              {images[selected].description && (
                <Typography variant="body2" color="text.secondary" mt={0.75}>
                  {images[selected].description}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
                {selected + 1} / {images.length}
              </Typography>
            </Box>
            {images.length > 1 && (
              <>
                <IconButton onClick={handlePrev} sx={galleryArrowStyles("left")} aria-label="Previous image">
                  <ChevronLeft size={30} />
                </IconButton>
                <IconButton onClick={handleNext} sx={galleryArrowStyles("right")} aria-label="Next image">
                  <ChevronRight size={30} />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}

function galleryArrowStyles(side) {
  return {
    position: "absolute",
    [side]: 12,
    top: "45%",
    transform: "translateY(-50%)",
    bgcolor: "rgba(15, 23, 42, 0.72)",
    color: "#fff",
    "&:hover": { bgcolor: "primary.main" },
  };
}
