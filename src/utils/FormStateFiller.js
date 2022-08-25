import produce from "immer";
import { set, has } from "lodash";

function enhancedReducer(state, updateArg) {
  // check if the type of update argument is a callback function
  if (updateArg.constructor === Function) {
    return { ...state, ...updateArg(state) };
  }

  // if the type of update argument is an object
  if (updateArg.constructor === Object) {
    // does the update object have _path and _value as it's keys
    // if yes then use them to update deep object values
    if (has(updateArg, "_path") && has(updateArg, "_value")) {
      const { _path, _value } = updateArg;

      return produce(state, draft => {
        set(draft, _path, _value);
      });
    } else {
      return { ...state, ...updateArg };
    }
  }
}

export default { enhancedReducer };