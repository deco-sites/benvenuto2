export interface Props {
  id: string;
  mapJSON: string;
}

const action = async (
  props: Props,
  _req: Request,
): Promise<void> => {
  const {
    mapJSON,
  } = props;
  console.log(mapJSON);
  return JSON.parse(mapJSON);
};

export default action;
