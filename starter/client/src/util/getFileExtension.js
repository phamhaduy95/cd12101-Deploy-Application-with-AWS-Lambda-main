export const getFileExtension = (fileName) => {
  const parts = fileName.split('.')
  const ext = parts.pop()
  return ext
}
