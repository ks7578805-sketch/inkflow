import { useState, useEffect, useCallback, useRef } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function useImageUpload({ onSuccess, onError }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError?.(`Formato não suportado. Use JPG, PNG ou WEBP.`);
      return false;
    }
    if (file.size > MAX_SIZE_BYTES) {
      onError?.(`Arquivo muito grande. Máximo ${MAX_SIZE_MB}MB.`);
      return false;
    }
    return true;
  }, [onError]);

  const loadFile = useCallback((file) => {
    if (!validateFile(file)) return;
    const url = URL.createObjectURL(file);
    onSuccess?.({
      url,
      name: file.name,
      size: file.size,
      type: file.type,
      width: null,
      height: null,
    });
    // get dimensions
    const img = new Image();
    img.onload = () => {
      onSuccess?.({
        url,
        name: file.name,
        size: file.size,
        type: file.type,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = url;
  }, [validateFile, onSuccess]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = "";
  }, [loadFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const loadFromUrl = useCallback(async (url) => {
    try {
      new URL(url);
      const response = await fetch(url);
      if (!response.ok) throw new Error("URL inválida ou inacessível.");
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) throw new Error("A URL não aponta para uma imagem válida.");
      const blob = await response.blob();
      const file = new File([blob], "imagem_url.jpg", { type: blob.type });
      loadFile(file);
    } catch (err) {
      onError?.(err.message || "Erro ao carregar imagem da URL.");
    }
  }, [loadFile, onError]);

  // Clipboard paste
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            loadFile(file);
            return;
          }
        }
      }
      onError?.("Nenhuma imagem encontrada no clipboard.");
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [loadFile, onError]);

  return {
    isDragOver,
    fileInputRef,
    openFilePicker,
    handleFileInputChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    loadFromUrl,
  };
}

export function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}