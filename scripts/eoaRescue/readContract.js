async function main() {
  const frozenAssets = await ethers.getContractAt("FrozenAssets", "0x429b1DadA1A851018dCa555C12fFC96a7815b566");
  const funcs = frozenAssets.interface.functions;
  const args = [];
  for (const [method, obj] of Object.entries(funcs)) {
    console.log(`\nfunction: ${method}`)
    const arg = [];
    for (const [key, val] of Object.entries(obj)) {
      if (key == "type") {
        console.log(`type: ${val}`)
        arg.push(val)
      }
      else if (key == "name") {
        console.log(`name: ${val}`)
        arg.push(val)
      }
      else if (key == "inputs") {
        arg.push(val.length ? 1 : 0)
      }
    }
    args.push(arg)  
  }
  console.log(args)
}

main();

  // type = ${Object.keys()}
  // name = ${Object.keys(value).name}
  // inputs = ${Object.keys(value).inputs}