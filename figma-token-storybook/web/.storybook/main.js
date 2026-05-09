import tailwindcss from "@tailwindcss/vite";

export default {
  stories: ["../src/**/*.stories.@(js|jsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  async viteFinal(config) {
    return {
      ...config,
      plugins: [...(config.plugins ?? []), tailwindcss()]
    };
  }
};