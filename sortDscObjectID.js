let arrObj = [{ "id": 1, "title": "a", "text": "asddsfdf" }, { "id": 2, "title": "b", "text": "asfdsadfssd" }, { "id": 3, "title": "c", "text": "asfsdafdssd" }];

function sortDscObjectId(arrObj) {
    const newArrObj = [];
    const idArr = arrObj.map(obj => {
        return obj.id;
    });
    // Create descending array of IDs
    const idArrDSC = idArr.sort((a, b) => b - a);
    // Create new array of object with descending IDs
    for (let id of idArrDSC) {
        for (let el of arrObj) {
            if (el.id === id) {
                newArrObj.push({ "id": el.id, "title": el.title, "text": el.text });
            }
        }
    }
    return newArrObj;
}

console.log(sortDscObjectId(arrObj));