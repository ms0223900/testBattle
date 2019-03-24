export const genRandom = (amount=1, min=1, max=10) => {
  let randomArr = []
  let count = 0
  const Min = max >= min ? min : max
  const maxCount = Math.abs(max - min) + 1
  const amountOfNum = amount > maxCount ? maxCount : amount
  while(count < amountOfNum) {
    let random = Min + ~~(Math.random() * maxCount)
    while(randomArr.indexOf(random) === -1) {
      randomArr = [...randomArr, random]
      count = count + 1
    }
  }
  return randomArr
}
export const setValueOfArrObj = (arrObj=[], id='', targetAttr='', value='') => {
  const ID = id * 1
  const arrObjLength = arrObj.length
  const tarObj = arrObj.filter(a => a.id === ID)[0]
  const arrObjOnlyId = arrObj.map(arr => arr = arr.id)
  const tarIndex = arrObjOnlyId.indexOf(ID)
  const valuedObj = { ...tarObj, [targetAttr]: value
  }
  if(tarIndex === 0) {
    return [
      valuedObj,
      ...arrObj.slice(1,arrObjLength)
    ]
  } else if(tarIndex === arrObjLength) {
    return [
      ...arrObj.slice(0, arrObjLength - 1),
      valuedObj
    ]
  } else {
    return [
      ...arrObj.slice(0, tarIndex),
      valuedObj,
      ...arrObj.slice(tarIndex + 1, arrObjLength)
    ]
  }
}
export const genArr = (num=10, from0or1=0) => {
  let arr = []
  let i = from0or1 === 0 ? 0 : 1
  while(i < num) {
    arr = [...arr, i]
    i += 1
  }
  return arr
}
export const getAllOrStarData = (star=false, amount=10, allData=[], isRandom=false) => {
  const starData = allData.filter(d => d.star)
  const Length = (length) => length > 1 ? length : 1
  let resultArr = []
  const randomArr = star ? 
    genRandom(amount, 0, Length(starData.length) - 1) : 
    genRandom(amount, 0, Length(allData.length) - 1)
  if(isRandom) {
    for (const i of randomArr) {
      resultArr = star ? 
        [...resultArr, starData[i]] : [...resultArr, allData[i]]
    }
  }else {
    resultArr = star ? starData.slice(0, amount) : allData.slice(0, amount)
  }
  return typeof(resultArr[0]) === 'undefined' ? [] : resultArr 
}
export const activeButton = (compareId='' , btnId='') => {
  const activeStyle = {
    backgroundColor: '#111', color: '#fff',
  }
  const normalStyle = {
    backgroundColor: '#ddd', color: '#111'
  }
  return compareId === btnId ? activeStyle : normalStyle
}
export const genOptionsWithABCD = (options) => {
  let arr = []
  const ABCD = ['A', 'B', 'C', 'D']
  for (let i = 0; i < options.length; i++) {
    arr[i] = {
      id: ABCD[i],
      options: options[i]
    }
  }
  return arr
}