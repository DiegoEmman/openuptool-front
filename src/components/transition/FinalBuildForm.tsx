import { useState, useEffect, type FormEvent } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import type { FinalBuild, CreateFinalBuildInput } from "../../types/transition";
import { finalBuildService } from "../../services/transitionService";

interface FinalBuildFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    projectId: string;
    build?: FinalBuild;
}

export function FinalBuildForm({
    open,
    onClose,
    onSuccess,
    projectId,
    build,
}: FinalBuildFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [buildNumber, setBuildNumber] = useState("");
    const [version, setVersion] = useState("");
    const [buildTag, setBuildTag] = useState("");
    const [commitHash, setCommitHash] = useState("");
    const [mainDownloadUrl, setMainDownloadUrl] = useState("");
    const [documentationUrl, setDocumentationUrl] = useState("");
    const [releaseNotesUrl, setReleaseNotesUrl] = useState("");
    const [targetPlatform, setTargetPlatform] = useState("");
    const [isStable, setIsStable] = useState(true);
    const [testsPassed, setTestsPassed] = useState("");
    const [testsTotal, setTestsTotal] = useState("");
    const [codeCoverage, setCodeCoverage] = useState("");

    useEffect(() => {
        if (build) {
            setBuildNumber(build.buildNumber);
            setVersion(build.version);
            setBuildTag(build.buildTag || "");
            setCommitHash(build.commitHash || "");
            setMainDownloadUrl(build.mainDownloadUrl || "");
            setDocumentationUrl(build.documentationUrl || "");
            setReleaseNotesUrl(build.releaseNotesUrl || "");
            setTargetPlatform(build.targetPlatform || "");
            setIsStable(build.isStable);
            setTestsPassed(build.testsPassed?.toString() || "");
            setTestsTotal(build.testsTotal?.toString() || "");
            setCodeCoverage(build.codeCoverage?.toString() || "");
        } else {
            resetForm();
        }
    }, [build, open]);

    const resetForm = () => {
        setBuildNumber("");
        setVersion("");
        setBuildTag("");
        setCommitHash("");
        setMainDownloadUrl("");
        setDocumentationUrl("");
        setReleaseNotesUrl("");
        setTargetPlatform("");
        setIsStable(true);
        setTestsPassed("");
        setTestsTotal("");
        setCodeCoverage("");
        setError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const input: CreateFinalBuildInput = {
                projectId,
                buildNumber,
                version,
                buildTag: buildTag || undefined,
                commitHash: commitHash || undefined,
                binaryArtifacts: [],
                mainDownloadUrl: mainDownloadUrl || undefined,
                documentationUrl: documentationUrl || undefined,
                releaseNotesUrl: releaseNotesUrl || undefined,
                targetPlatform: targetPlatform || undefined,
                isStable,
                testsPassed: testsPassed ? parseInt(testsPassed) : undefined,
                testsTotal: testsTotal ? parseInt(testsTotal) : undefined,
                codeCoverage: codeCoverage
                    ? parseFloat(codeCoverage)
                    : undefined,
            };

            if (build) {
                await finalBuildService.update(build.id, input);
            } else {
                await finalBuildService.create(input);
            }

            onSuccess();
            onClose();
            resetForm();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error al guardar el build"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {build ? "Editar Build Final" : "Crear Build Final"}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <TextField
                            label="Número de Build *"
                            value={buildNumber}
                            onChange={(e) => setBuildNumber(e.target.value)}
                            required
                            fullWidth
                            helperText="Ej: B-1.0, BUILD-001"
                        />
                        <TextField
                            label="Versión *"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            required
                            fullWidth
                            helperText="Ej: 1.0.0, 2.1.5"
                        />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <TextField
                            label="Build Tag"
                            value={buildTag}
                            onChange={(e) => setBuildTag(e.target.value)}
                            fullWidth
                            helperText="Ej: release-v1.0"
                        />
                        <TextField
                            label="Commit Hash"
                            value={commitHash}
                            onChange={(e) => setCommitHash(e.target.value)}
                            fullWidth
                            helperText="Hash del commit de Git"
                        />
                    </Box>

                    <TextField
                        label="URL de Descarga Principal"
                        value={mainDownloadUrl}
                        onChange={(e) => setMainDownloadUrl(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        helperText="URL donde se puede descargar el build"
                    />

                    <TextField
                        label="URL de Documentación"
                        value={documentationUrl}
                        onChange={(e) => setDocumentationUrl(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        helperText="Link a la documentación técnica"
                    />

                    <TextField
                        label="URL de Notas de Lanzamiento"
                        value={releaseNotesUrl}
                        onChange={(e) => setReleaseNotesUrl(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        helperText="Link a las release notes"
                    />

                    <TextField
                        label="Plataforma Objetivo"
                        value={targetPlatform}
                        onChange={(e) => setTargetPlatform(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        helperText="Ej: Windows x64, Linux, Web"
                    />

                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <TextField
                            label="Pruebas Aprobadas"
                            type="number"
                            value={testsPassed}
                            onChange={(e) => setTestsPassed(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Total de Pruebas"
                            type="number"
                            value={testsTotal}
                            onChange={(e) => setTestsTotal(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Cobertura (%)"
                            type="number"
                            value={codeCoverage}
                            onChange={(e) => setCodeCoverage(e.target.value)}
                            fullWidth
                            inputProps={{ step: "0.1", min: "0", max: "100" }}
                        />
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isStable}
                                onChange={(e) => setIsStable(e.target.checked)}
                            />
                        }
                        label="Build Estable (Production Ready)"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading
                            ? "Guardando..."
                            : build
                              ? "Actualizar"
                              : "Crear"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
