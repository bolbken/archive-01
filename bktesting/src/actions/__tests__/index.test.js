import { saveComment } from "../../actions";
import { SAVE_COMMENT } from "../types";
import { isTSAnyKeyword } from "@babel/types";

describe("saveComment", () => {
  it("has a correct type", () => {
    const action = saveComment();

    expect(action.type).toEqual(SAVE_COMMENT);
  });

  it("has the correct payload", () => {
    const action = saveComment("New Comment");

    expect(action.payload).toEqual("New Comment");
  });
});
