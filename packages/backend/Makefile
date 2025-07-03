# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/03 23:19:05 by abenamar          #+#    #+#              #
#    Updated: 2025/07/04 00:49:00 by abenamar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME := package-lock.json

SCRIPTS_DIR := ./scripts

RM := rm -f

DOCKER := docker

setup:
	@$(SCRIPTS_DIR)/setup.sh

build: setup $(NAME)
	@$(SCRIPTS_DIR)/build.sh $${BUILD_OPTIONS}

all: build

clean:
	$(RM) $(NAME)

fclean: clean
	$(DOCKER) compose down --rmi all --volumes

re: fclean all

.PHONY: setup build all clean fclean re
