try {
  const result = await fetch('personal-info.txt')
  const text = await result.text()
} catch (err) {
  console.log(err)
}
