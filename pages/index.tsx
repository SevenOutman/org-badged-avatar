import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Slider } from "rsuite";

function useImage(src: string) {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);

  useEffect(() => {
    if (typeof Image === "undefined") return;
    const image = new Image();
    image.onload = () => {
      console.log(image.width, image.height);
      setImage(image);
    };
    image.src = src;
  }, [src]);

  return image;
}

export default function Home() {
  const [username, setUsername] = useState("SevenOutman");
  const [org, setOrg] = useState("rsuite");

  const [orgAvatarSize, setOrgAvatarSize] = useState(30);
  const [hPosition, setHPosition] = useState(35);
  const [vPosition, setVPosition] = useState(100);

  const hOffset = ((100 - orgAvatarSize) * hPosition) / 100;
  const vOffset = ((100 - orgAvatarSize) * vPosition) / 100;

  const divRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const userImage = useImage(`https://github.com/${username}.png`);
  const orgImage = useImage(`https://github.com/${org}.png`);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, 500, 500);

        if (userImage) {
          ctx.drawImage(userImage, 0, 0, 500, 500);
        }

        if (orgImage) {
          const hOffset = (((100 - orgAvatarSize) * hPosition) / 100) * 5;
          const vOffset =
            500 -
            orgAvatarSize * 5 -
            (((100 - orgAvatarSize) * vPosition) / 100) * 5;

          ctx.drawImage(
            orgImage,
            hOffset,
            vOffset,
            orgAvatarSize * 5,
            orgAvatarSize * 5
          );
        }
      }
    }
  }, [hPosition, orgAvatarSize, orgImage, userImage, vPosition]);

  return (
    <main className="min-h-screen p-24">
      <h1>Org-Badged Avatar</h1>

      <Input
        type="text"
        value={username}
        onChange={setUsername}
        style={{ display: "inline-block", width: "unset" }}
      />

      <Input
        type="text"
        value={org}
        onChange={setOrg}
        style={{ display: "inline-block", width: "unset" }}
      />
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ width: 250, height: 250 }}
      />

      <div>
        <div className="flex">
          <div
            ref={divRef}
            className="relative rounded-full overflow-hidden"
            style={{ width: 250, height: 250 }}
          >
            {username ? (
              <img
                src={`https://github.com/${username}.png`}
                alt=""
                className="block h-full w-full select-none pointer-events-none"
              />
            ) : null}

            <div
              className="absolute bg-white rounded overflow-hidden"
              style={{
                width: `${orgAvatarSize}%`,
                height: `${orgAvatarSize}%`,
                left: `${hOffset}%`,
                bottom: `${vOffset}%`,
              }}
            >
              {org ? (
                <img
                  src={`https://github.com/${org}.png`}
                  alt=""
                  className="w-full h-full select-none pointer-events-none"
                />
              ) : null}
            </div>
          </div>

          <Slider
            value={vPosition}
            onChange={setVPosition}
            min={0}
            max={100}
            vertical
            style={{ height: 200 }}
          />
        </div>
        <Slider
          value={hPosition}
          onChange={setHPosition}
          min={0}
          max={100}
          style={{ width: 200 }}
        />
      </div>
      <Slider
        value={orgAvatarSize}
        onChange={setOrgAvatarSize}
        min={0}
        max={100}
        style={{ width: 200 }}
      />

      <Button
        appearance="primary"
        onClick={() => {
          const canvas = canvasRef.current;
          const dataUrl = canvas?.toDataURL();
          const link = document.createElement("a");
          link.download = "my-image-name.png";
          link.href = dataUrl;
          link.click();
        }}
      >
        Save Image
      </Button>
    </main>
  );
}
