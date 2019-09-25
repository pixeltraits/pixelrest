class SortTools {

  uniqBy(collection, field) {
    const result = [];

    collection.forEach(row => {
      const found = result.find(r => r[field] === row[field]);

      if (!found) {
        result.push({...row});
      }
    });

    return result;
  }

  uniqByField(collection, field) {
    const result = [];

    collection.forEach(row => {
      const found = result.find(r => r === row[field]);

      if (!found) {
        result.push(row[field]);
      }
    });

    return result;
  }

}

module.exports = SortTools;
