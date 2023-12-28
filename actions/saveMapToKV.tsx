import { AppContext } from "../apps/site.ts";

export interface Props {
  mapJSON: string;
}

const action = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<void> => {
  const {
    mapJSON,
  } = props;
  console.log(mapJSON);
};

export default action;
