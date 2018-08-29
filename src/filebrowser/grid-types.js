// w2ui.browserCategories

const FolderTypes = ["PF", "TEXTURE"];

function renderNodes(fileTypes) {
  for (const folder of FolderTypes) {
    w2ui.browserCategories.add({
      id: folder,
      text: folder,
      img: "icon-folder"
    });
  }

  for (const type of fileTypes) {
    const parentId = FolderTypes.find(x => {
      return type.startsWith(x);
    });
    if (parentId) {
      w2ui.browserCategories.add(parentId, {
        id: type,
        text: type,
        img: "icon-page"
      });
    } else {
      w2ui.browserCategories.add({
        id: type,
        text: type,
        img: "icon-page"
      });
    }
  }
}

function getTypes(fileList) {
  return fileList.reduce((acc, cv) => {
    if (!acc.includes(cv.fileType)) acc.push(cv.fileType);
    return acc;
  }, []);
}

module.exports = {
  renderNodes,
  getTypes
};
