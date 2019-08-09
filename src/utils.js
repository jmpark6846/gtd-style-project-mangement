import uuid from "uuid/v4";

export const generateId = () => {
  return uuid()
    .split("-")
    .join("");
};



export const getSortedByOrderProp = (obj) => {
  return Object.values(obj).sort((a, b) => a.order - b.order);
};