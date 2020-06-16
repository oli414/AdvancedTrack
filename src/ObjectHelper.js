
class ObjectHelper {
    static GetObjectIndex(type, identifier) {
        let list = context.getAllObjects(type)
        for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            if (obj.identifier.trim() === identifier) {
                return obj.index;
            }
        }
    }
}

export default ObjectHelper;