# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/03 23:19:05 by abenamar          #+#    #+#              #
#    Updated: 2025/07/04 19:20:06 by abenamar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

setup:
	@./scripts/setup.sh

build: setup
	@./scripts/build.sh $${BUILD_OPTIONS}

all: build

clean:
	rm -f package-lock.json

fclean: clean
	docker compose down --rmi all --volumes

re: fclean all

.PHONY: setup build all clean fclean re
