# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/06 14:53:45 by abenamar          #+#    #+#              #
#    Updated: 2025/07/06 21:38:15 by abenamar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

setup:
	@./scripts/setup.sh

build: setup
	@./scripts/build.sh $${BUILD_OPTIONS}

all: build

clean:
	@./scripts/clean.sh

fclean: clean
	docker compose down --rmi all --volumes

re: fclean all

.PHONY: setup build all clean fclean re
