import { defineConfig, presetMini } from "unocss";

export default defineConfig({
  presets: [presetMini()],
  rules: [
    [
      "flex-center",
      { display: "flex", "justify-content": "center", "align-items": "center" },
    ],
    [ "object-cover", { "object-fit": "cover" }, ],
    [ "object-contain", { "object-fit": "contain" }, ],
    [
      "flex-col-center",
      {
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
      },
    ]
  ],
});
