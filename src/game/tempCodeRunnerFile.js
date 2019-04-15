console.log([ 
  { id: 'a', cid: 0 },
  { id: 'a', cid: 1 },
  { id: 'b', cid: 1 },
].filter(a => a.id !== 'a' && a.cid !== 1))