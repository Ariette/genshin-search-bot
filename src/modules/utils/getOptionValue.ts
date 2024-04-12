import { APIApplicationCommandInteractionDataOption, ApplicationCommandOptionType } from 'discord-api-types/v10';

export const getOptionValue = (option: APIApplicationCommandInteractionDataOption): string | number | boolean => {
  switch (option.type) {
    case ApplicationCommandOptionType.Subcommand:
    case ApplicationCommandOptionType.SubcommandGroup:
      if (option.options?.length) return getOptionValue(option.options[0]);
      return '';
    default:
      return option.value;
  }
};
