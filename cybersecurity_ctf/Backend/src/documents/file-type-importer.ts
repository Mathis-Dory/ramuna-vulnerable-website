async function fileTypeFromBuffer(buffer) {
  const fileTypeModule = await import('file-type');
  return fileTypeModule.fileTypeFromBuffer(buffer);
}

export { fileTypeFromBuffer };
