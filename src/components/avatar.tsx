import { Avatar } from "./ui/avatar";

export default function AnonAvatar() {
  return (
    <Avatar
      size="small"
      elevated
      src="https://www.tailframes.com/images/avatar.webp"
      className="object-cover lg:w-14 lg:h-12 w-12 h-10"
    />
  );
}
