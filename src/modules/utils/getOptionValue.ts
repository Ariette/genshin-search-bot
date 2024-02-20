import { APIApplicationCommandInteractionDataOption, ApplicationCommandOptionType } from 'discord-api-types/v10';

export const getOptionValue = (option: APIApplicationCommandInteractionDataOption): string | number | boolean => {
  switch (option.type) {
    case ApplicationCommandOptionType.Subcommand:
    case ApplicationCommandOptionType.SubcommandGroup:
      return getOptionValue(option.options?.[0]!);
    default:
      return option.value;
  }
};
